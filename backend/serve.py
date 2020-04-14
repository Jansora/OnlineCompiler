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

curDir = os.getcwd()

compiles = {
    "java": JavaCompiler,
    "python": PythonCompiler,
    "go": GoCompiler,
    "node": NodeJsCompiler,
}

def wrapper(language, code):
    subDir = str(random.random()).replace(".", "")
    dirPath = os.path.join(curDir, subDir)


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

class MainHandler(tornado.web.RequestHandler):

    def get(self):

        self.write("get")

    def post(self, language=None,b=None,c=None):
        args = self.request.arguments
        language = args.get("language")
        code = args.get("code")
        if(not language or not code):
            self.write({'status': False, 'message': '参数不能为空', 'data': None})

        status, data = wrapper(language[0].decode("utf-8"), code[0].decode("utf-8"))
        self.write({'status': status, 'message': data if not status else "", 'data': data})





def make_app():
    return tornado.web.Application([
        (r"/playground/compiler", MainHandler),
    ], debug=True)

if __name__ == "__main__":
    app = make_app()
    app.listen(9002)
    tornado.ioloop.IOLoop.current().start()
