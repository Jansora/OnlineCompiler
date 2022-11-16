package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.system.NotImplementException;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 12:17:20
 */
public class JavaCompiler implements Compiler {

    @Override
    public Compiler getInstance(String language) throws NotImplementException {
        return Compiler.super.getInstance(language);
    }

    @Override
    public String compile(String code) {
        return null;
    }
}
