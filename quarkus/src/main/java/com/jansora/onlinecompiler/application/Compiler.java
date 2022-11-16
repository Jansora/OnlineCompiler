package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.exception.system.CommandException;
import com.jansora.onlinecompiler.exception.system.NotImplementException;
import com.jansora.onlinecompiler.payload.ResultDto;
import com.jansora.onlinecompiler.util.FileUtils;

import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.Base64;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 11:39:15
 */
public interface Compiler {

    default Compiler getInstance(String language) throws NotImplementException {
        throw new NotImplementException();
    }

    default String getCwd(String content) {
        String dir = Paths.get("/Users", "jansora", "tmp","app","data", String.valueOf(content.hashCode()).replace("-", "")).toString();
        FileUtils.mkdir(dir);
        return dir;
    }

    /**
     * 编译代码
     */
    ResultDto compile(String code) throws BaseAppException;
}
