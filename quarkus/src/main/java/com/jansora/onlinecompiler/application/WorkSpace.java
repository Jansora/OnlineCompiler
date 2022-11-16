package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.util.FileUtils;

import java.nio.file.Paths;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 16:45:55
 */
public interface WorkSpace {

    default String getCwd(String content) {
//        String dir = Paths.get("/app","data", String.valueOf(content.hashCode()).replace("-", "")).toString();
        String dir = Paths.get("/Users", "jansora", "tmp","app","data", String.valueOf(content.hashCode()).replace("-", "")).toString();
        FileUtils.mkdir(dir);
        return dir;
    }

}