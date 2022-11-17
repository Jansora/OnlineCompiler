package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.exception.system.NotImplementException;
import com.jansora.onlinecompiler.payload.ResultDto;
import com.jansora.onlinecompiler.util.FileUtils;

import java.nio.file.Paths;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 11:39:15
 */
public interface Compiler extends WorkSpace {

    default Compiler getInstance(String language) throws NotImplementException {
        throw new NotImplementException();
    }

    default String getCwd() {
//        String dir = Paths.get("/app","data").toString();
        String baseDir = null != System.getenv("ONLINE_COMPILER_PWD") ? System.getenv("ONLINE_COMPILER_PWD") : System.getenv("PWD");
        String dir = Paths.get(baseDir,"data", "compiler").toString();
        FileUtils.mkdir(dir);
        return dir;
    }


    /**
     * 编译代码
     */
    ResultDto compile(String code) throws BaseAppException;
}
