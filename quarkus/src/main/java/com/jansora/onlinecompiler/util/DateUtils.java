package com.jansora.onlinecompiler.util;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 16:50:33
 */

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * <Description> Description for DateUtils <br>
 *
 * @author jansora <br>
 * @version 1.0 <br>
 * @github https://github.com/Jansora
 * @CreateDate 2021/5/16 20:55:11 <br>
 * @since 1.0 <br>
 */
public class DateUtils {

    private static final SimpleDateFormat tableDf = new SimpleDateFormat("yyyy_MM");

    private static final SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");

    private static final SimpleDateFormat tf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static final SimpleDateFormat tm = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    public static String formatNow() {
        return df.format(new Date());
    }

    public static String formatNowTime() {
        return tf.format(new Date());
    }
    public static String formatNowTimestamp() {
        return tm.format(new Date());
    }

    public static String formatTime(Date date) {
        return tf.format(date);
    }

    public static String format(Date date) {
        return df.format(date);
    }

    public static String format(Number year, Number month, Number day) {
        return year + "-" + month + "-" + day;
    }

    public static String formatToday() {
        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, 0); // same for minutes and seconds
        return df.format(today);
    }



}
