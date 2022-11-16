package com.jansora.onlinecompiler;

import com.jansora.onlinecompiler.application.Compiler;
import com.jansora.onlinecompiler.application.*;
import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.payload.CodeReq;
import com.jansora.onlinecompiler.payload.ResultDto;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
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

    @Inject
    PythonCompiler pythonCompiler;

    @Inject
    NodeCompiler nodeCompiler;

    @Inject
    GoCompiler goCompiler;

    private Compiler getCompiler(String language) {
        if (null != language && "java".equals(language.toLowerCase(Locale.ROOT))) {
            return javaCompiler;
        }
        if (null != language && "go".equals(language.toLowerCase(Locale.ROOT))) {
            return goCompiler;
        }
        if (null != language && "python".equals(language.toLowerCase(Locale.ROOT))) {
            return pythonCompiler;
        }
        if (null != language && "node".equals(language.toLowerCase(Locale.ROOT))) {
            return nodeCompiler;
        }
        return javaCompiler;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/playground/compiler")
    public ResultDto compile(CodeReq req) throws BaseAppException {
        return getCompiler(req.getLanguage()).compile(req.getCode());
    }

}
