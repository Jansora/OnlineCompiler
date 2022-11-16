package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.system.NotImplementException;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 11:39:15
 */
public interface Compiler {

    default Compiler getInstance(String language) throws NotImplementException {
        throw new NotImplementException();
    }

    /**
     * 编译代码
     */
    String compile(String code);
}
