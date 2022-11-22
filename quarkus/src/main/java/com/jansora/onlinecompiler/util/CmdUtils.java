package com.jansora.onlinecompiler.util;


import com.jansora.onlinecompiler.exception.system.CommandException;
import com.jansora.onlinecompiler.payload.ResultDto;
import io.quarkus.runtime.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Arrays;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

/**
 * 读取命令行
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 12:10:46
 */
public class CmdUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(CmdUtils.class);

    /**
     * 执行命令并获得输出结果
     *
     * @param cmd 命令
     * @return ResultDto<String>
     */
    public static ResultDto syncRun(String dirPath, String... cmd) {
        try {
            UUID uuid = UUID.randomUUID();
            LOGGER.info("CMD sync run: uuid: {} \n cmd: [{}] \n pwd: [{}]", uuid, Arrays.toString(cmd), dirPath);

            Process process = Runtime.getRuntime().exec(cmd, null, new File(dirPath));

            int exitCode = process.waitFor();
            boolean status = exitCode == 0;

            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(status ? process.getInputStream() : process.getErrorStream()));

            StringBuilder sb = new StringBuilder();
            String line = "";
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }

//            boolean status = exitCode == 0;

//            try (final BufferedReader b = new BufferedReader(new InputStreamReader(status ? process.getInputStream() : process.getErrorStream()))) {

            ResultDto result = status ? ResultDto.SUCCESS(sb.toString()) : ResultDto.FAIL(new CommandException(sb.toString()));


            LOGGER.info("CMD sync run: uuid: [{}] \n  result: [{}]", Arrays.toString(cmd), result);
            return result;


        } catch (IOException e) {
            LOGGER.error("exec CmdUtils.run failed. IOException:", e);
            return ResultDto.FAIL(new CommandException(Arrays.toString(e.getStackTrace())));
        } catch (InterruptedException e) {
            LOGGER.error("exec CmdUtils.run failed. InterruptedException:", e);
            return ResultDto.FAIL(new CommandException(Arrays.toString(e.getStackTrace())));
        }
//        return ResultDto.FAIL(new CommandException());
    }

    /**
     * 异步执行命令
     *
     * @param dirPath  目录
     * @param consumer 消费lambda
     * @param cmd      命令
     */
    public static void asyncRun(String dirPath, Consumer<String> consumer, String... cmd) {
        try {
            ProcessBuilder builder = new ProcessBuilder();
            System.out.println("cmd exec dir: " + dirPath + "\n cmd:");
            System.out.println(Arrays.toString(cmd));
            if (!StringUtil.isNullOrEmpty(dirPath)) {
                builder.directory(new File(dirPath));
            }

            builder.command(cmd);
            Process process = builder.start();
            StreamGobbler streamGobbler =
                    new StreamGobbler(process.getInputStream(), consumer);
            Executors.newSingleThreadExecutor().submit(streamGobbler);
        } catch (IOException e) {
            LOGGER.error("exec CmdUtils.run failed. IOException:", e);
        }
    }

    private static class StreamGobbler implements Runnable {
        private final InputStream inputStream;
        private final Consumer<String> consumer;

        public StreamGobbler(InputStream inputStream, Consumer<String> consumer) {
            this.inputStream = inputStream;
            this.consumer = consumer;
        }

        @Override
        public void run() {
            new BufferedReader(new InputStreamReader(inputStream)).lines().forEach(consumer);
        }
    }
}
