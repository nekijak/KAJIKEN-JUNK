package jp.kajiken.timezone;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class TimezoneTest {

    public static void main(String[] args) {
        try {
            DSTTest();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void indexOf() {
        System.out.println("execUpdate".indexOf("exec"));
        System.out.println("formatExec".indexOf("exec"));
    }


    public static void DSTTest() throws Exception {
        while (true) {
            /*
            Calendar cal = Calendar.getInstance();
            cal.set(2013, 7, 28, 17, 30, 0);
            Date now = cal.getTime();
            */
            Date now = new Date();
            TimeZone def = TimeZone.getDefault();
            DST(def, now);
            DST(TimeZone.getTimeZone("JST"), now);
            TimeZone.setDefault(def);

            System.out.println("---------------------------------------");
//            DST(TimeZone.getTimeZone("America/New_York"), now);

            /*
            cal.set(2013, 0, 1, 17, 30, 0);
            now = cal.getTime();

            DST(TimeZone.getTimeZone("JST"), now);
            DST(TimeZone.getTimeZone("America/New_York"), now);
            */
            Thread.sleep(1000);
        }
    }

    public static void DST(TimeZone tz, Date now) {
        TimeZone.setDefault(tz);
        String bb = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(now);
        System.out.println(bb);
        System.out.println("inDaylightTime:" + tz.inDaylightTime(now));
        System.out.println("TimeZone:" + tz.getDisplayName(tz.inDaylightTime(now), TimeZone.SHORT, Locale.ENGLISH) + "\n");
    }

    public static void bytesTest() throws Exception {
        bytes("EUC-JP");
        bytes("MS932");
        bytes("UTF-8");
        bytes("UTF-16");
        bytes("UnicodeLittle");
        bytes("Windows-31j");
        bytes("ISO-8859-1");
        bytes("Shift_JIS");
        bytes("SJIS");
        bytes("ISO2022JP");
        bytes("GBK");
    }


    public static void bytes(String enc) throws Exception {
        String aaa = "Åitest strings";
        byte[] bb =  aaa.getBytes(enc);
        String cc = "";
        for (int i = 0; i < bb.length; ++i) {
            cc += bb[i] + " ";
        }
        System.out.println(cc);

        byte[] zz = { -124 };
        String xx = new String(zz);
        System.out.println(xx);
    }

    public static void bit() {
        boolean aa = true;
        boolean bb = true;
        System.out.println((aa ? 1 : 0) | ((bb ? 1 : 0) << 1));
    }

    public static void timezone() {
        TimeZone tz = TimeZone.getDefault();
        System.out.println("start");
        for (String tzid : TimeZone.getAvailableIDs()) {
            tz = TimeZone.getTimeZone(tzid);
            if (tz.getDisplayName().indexOf("ïWèÄéû") == -1) {
                continue;
            }
            System.out.println(tz.getID());
            System.out.println(tz.getDisplayName());
            System.out.println(tz.getDisplayName(Locale.ENGLISH));
            System.out.println(tz.getDisplayName(tz.useDaylightTime(), TimeZone.SHORT, Locale.ENGLISH));
            System.out.println("------------------------------------");
        }
    }
}
