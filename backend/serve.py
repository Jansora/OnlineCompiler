import tornado

import tornado.ioloop
import tornado.web

from language.java import compiler as JavaCompiler
from language.python import compiler as PythonCompiler
from language.golang import compiler as GoCompiler
from language.nodejs import compiler as NodeJsCompiler
import os
import random
from pathlib import Path
import shutil
import json
import sys
import codecs

curDir = os.path.join(os.getcwd(), "data")
if not Path(curDir).is_dir():
    Path(curDir).mkdir()

compiles = {
    "java": JavaCompiler,
    "python": PythonCompiler,
    "go": GoCompiler,
    "node": NodeJsCompiler,
}

def compileWrapper(language, code):

    compileDir = os.path.join(curDir, "compile")

    if not Path(compileDir).is_dir():
        Path(compileDir).mkdir()

    dirPath = os.path.join(compileDir, str(hash(code)))

    Path(dirPath).mkdir()


    compile = compiles.get(language)
    status, data = False, None
    try:
        status, data = compile(dirPath, code)
    except:
        pass
    finally:
        shutil.rmtree(dirPath)

    return status, data

def shareGetWrapper(language, codePath):

    shareDir = os.path.join(curDir, "share")
    if not Path(shareDir).is_dir():
        Path(shareDir).mkdir()

    filePath = os.path.join(os.path.join(shareDir , language) , codePath)
    try:

        with open(filePath, "r") as fp:
            return fp.read()
    except:
        return ''


def sharePostWrapper(language, code):

    shareDir = os.path.join(curDir, "share")
    if not Path(shareDir).is_dir():
        Path(shareDir).mkdir()

    codeDir = os.path.join(os.path.join(curDir, "share"), language)

    if not Path(codeDir).is_dir():
        Path(codeDir).mkdir()

    codePath = str(hash(code))

    filePath = os.path.join(codeDir , codePath)

    try:

        with open(filePath, "w+") as fp:
            fp.write(code)
        return True, codePath
    except Exception as e:
        return False, str(e)





class ShareHandler(tornado.web.RequestHandler):

    def get(self):
        args = self.request.arguments
        codePath = args.get("share")
        language = args.get("language")
        if not language or not codePath:
            self.write({'status': False, 'message': '参数不能为空', 'data': None})


        data = shareGetWrapper(language[0].decode("utf-8"), codePath[0].decode("utf-8"))
        self.write({'status': True, 'message': "", 'data': data})

    def post(self, language=None,b=None,c=None):
        args = json.loads(self.request.body.decode('utf8'))
        language = args.get("language")
        code = args.get("code")
        if not language or not code:
            self.write({'status': False, 'message': '参数不能为空', 'data': None})

        status, data = sharePostWrapper(language, code)

        self.write({'status': status, 'message': data if not status else "", 'data': data})



class CompilerHandler(tornado.web.RequestHandler):

    def get(self):

        self.write("get")

    def post(self, language=None,b=None,c=None):
        args = json.loads(self.request.body.decode('utf-8'))
        print(f"CompilerHandler post start args={args}")
        language = args.get("language")
        code = args.get("code")
        if(not language or not code):
            self.write({'status': False, 'message': '参数不能为空', 'data': None})

        status, data = compileWrapper(language, code)
        result = {'status': status, 'message': data if not status else "", 'data': data}
        print(f"CompilerHandler post end result={result}")
        self.write(result)




def make_app():
    return tornado.web.Application([
        (r"/playground/compiler", CompilerHandler),
        (r"/playground/share", ShareHandler),
    ], debug=True)

if __name__ == "__main__":
    app = make_app()
    app.listen(51091)
    tornado.ioloop.IOLoop.current().start()
