package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.util.FileUtils;

import javax.enterprise.context.ApplicationScoped;
import java.nio.file.Paths;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-21 14:47:45
 */
@ApplicationScoped
public class Share implements WorkSpace {

    @Override
    public String getCwd() {
        //        String dir = Paths.get("/app","data").toString();
        String baseDir = null != System.getenv("ONLINE_COMPILER_PWD") ? System.getenv("ONLINE_COMPILER_PWD") : System.getenv("PWD");
        String dir = Paths.get(baseDir,"data", "share").toString();
        FileUtils.mkdir(dir);
        return dir;
    }
}
