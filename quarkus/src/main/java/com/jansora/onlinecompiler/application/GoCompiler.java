package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.payload.ResultDto;
import com.jansora.onlinecompiler.util.CmdUtils;
import com.jansora.onlinecompiler.util.FileUtils;

import javax.enterprise.context.ApplicationScoped;
import java.io.File;
import java.nio.file.Paths;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 12:17:20
 */
@ApplicationScoped
public class GoCompiler implements Compiler {


    private static final GoCompiler instance = new GoCompiler();
    @Override
    public Compiler getInstance(String language) {
        return instance;
    }

    @Override
    public ResultDto compile(String code) throws BaseAppException {


        String filename = "Demo.go";
        String cwdPath = Paths.get(getCwd(), "compiler").toString();
        String filePath = Paths.get(cwdPath, String.valueOf(code.hashCode()).replace("-", ""), filename).toString();
        FileUtils.writeFile(new File(filePath), code, false);
        return CmdUtils.syncRun(cwdPath, "go", "run", filename);


    }
}
