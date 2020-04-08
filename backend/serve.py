import tornado

import tornado.ioloop
import tornado.web

from language.java import compiler as JavaCompiler

class MainHandler(tornado.web.RequestHandler):

    def get(self):

        self.write("get")

    def post(self, language=None,b=None,c=None):
        args = self.request.arguments
        language = args.get("language")
        code = args.get("code")
        if(not language or not code):
            self.write({'status': False, 'message': '参数不能为空', 'data': None})

        status, data = JavaCompiler(code[0].decode("utf-8") )
        self.write({'status': status, 'message': data if not status else "", 'data': data})





def make_app():
    return tornado.web.Application([
        (r"/playground/compiler", MainHandler),
    ], debug=True)

if __name__ == "__main__":
    app = make_app()
    app.listen(9002)
    tornado.ioloop.IOLoop.current().start()
