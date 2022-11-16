package com.jansora.onlinecompiler;

import com.jansora.onlinecompiler.application.Compiler;
import com.jansora.onlinecompiler.application.JavaCompiler;
import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.payload.CodeReq;
import com.jansora.onlinecompiler.payload.ResultDto;
import io.quarkus.runtime.util.StringUtil;
import org.acme.getting.started.GreetingService;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.*;
import javax.inject.Inject;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import java.util.Locale;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 11:36:42
 */
@Path("/api")

public class OnlineCompilerResource {

    @Inject
    JavaCompiler javaCompiler;

    private Compiler getCompiler(String language) {
        if (null != language && "java".equals(language.toLowerCase(Locale.ROOT))) {
            return javaCompiler;
        }
        return javaCompiler;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/playground/compiler")
    public ResultDto compile(CodeReq req) throws BaseAppException {
//        CodeReq req = new CodeReq();
//        req.setLanguage("language");
//        req.setCode("import java.util.Collections;\n\npublic class Clazz {\n  public static void main(String[] args) {\n    System.out.println(Collections.singletonList(\"hello, world!\"));\n  }\n}\n  \n  ");
        return getCompiler(req.getLanguage()).compile(req.getCode());
    }

}
