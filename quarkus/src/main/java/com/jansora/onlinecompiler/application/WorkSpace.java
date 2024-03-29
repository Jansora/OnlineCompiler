package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.util.FileUtils;

import java.nio.file.Paths;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 16:45:55
 */
public interface WorkSpace {

    default String getCwd() {
//        String dir = Paths.get("/app","data").toString();
        String baseDir = null != System.getenv("ONLINE_COMPILER_PWD") ? System.getenv("ONLINE_COMPILER_PWD") : System.getenv("PWD");
        String dir = Paths.get(baseDir,"data").toString();
        FileUtils.mkdir(dir);
        return dir;
    }

}
