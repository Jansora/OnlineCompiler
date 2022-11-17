package com.jansora.onlinecompiler;

import com.jansora.onlinecompiler.application.Compiler;
import com.jansora.onlinecompiler.application.*;
import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.payload.CodeReq;
import com.jansora.onlinecompiler.payload.ResultDto;
import com.jansora.onlinecompiler.util.FileUtils;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

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
        try {
            return getCompiler(req.getLanguage()).compile(req.getCode());
        }
        catch (BaseAppException e) {
            return ResultDto.FAIL(e);
        }
        catch (Exception e) {
            return ResultDto.FAIL("服务器执行异常", e.getLocalizedMessage());
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/playground/share")
    public ResultDto share(CodeReq req) throws BaseAppException {

        String cwdPath = javaCompiler.getCwd();
        String fileName = UUID.randomUUID().toString();
        FileUtils.writeFile(Paths.get(cwdPath, "share", req.getLanguage(), fileName).toFile(), req.getCode(), false);
        return ResultDto.SUCCESS(fileName);
    }

    @GET
    @Produces(MediaType.APPLICATION_FORM_URLENCODED)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/playground/share")
    public ResultDto share(@QueryParam("share") String share, @QueryParam("language") String language) throws BaseAppException, IOException {

        String cwdPath = javaCompiler.getCwd();
        try {
            String content = Files.readString(Paths.get(cwdPath, "share", language, share));
            return ResultDto.SUCCESS(content);
        }
        catch (Exception e) {
            System.out.println();
        }


        return ResultDto.FAIL("404", "未找到该资源");
    }
}
