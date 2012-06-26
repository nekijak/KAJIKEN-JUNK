package jp.kajiken.input;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;


public class InputStreamTest {
    public static void main(String args[]) throws Exception {
        // 通常の読み出し：2回目がNULLになる
        nomalInput();

        // 読み出し→InputStream再作成：2回目も取れるが...美しくない
        inputAndReCreate();

        // シリアライズ→デシリアライズ
        inputAndCreateOutput();

        // Mark and Reset:ByteArrayInputStreamではうまくいく
        inputMark();
    }

    private static void nomalInput() throws Exception {
        InputStream bais = new ByteArrayInputStream("あいうえおかきくけこ".getBytes("UTF-8"));
        System.out.println("nomalInput 1回目の呼び出し:" + inputStreemToString(bais));
        System.out.println("nomalInput 2回目の呼び出し:" + inputStreemToString(bais)); // NULL
    }

    private static void inputAndReCreate() throws Exception {
        InputStream bais = new ByteArrayInputStream("あいうえおかきくけこ".getBytes("UTF-8"));
        String getString = inputStreemToString(bais);
        System.out.println("inputAndReCreate 1回目の呼び出し:" + getString);
        bais = new ByteArrayInputStream(getString.getBytes("UTF-8"));
        System.out.println("inputAndReCreate 2回目の呼び出し:" + inputStreemToString(bais));
    }

    private static void inputAndCreateOutput() throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(baos);
        oos.writeObject("あいうえおかきくけこ");
        oos.close();
        baos.close();
        ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());

        ObjectInputStream ois = new ObjectInputStream(bais);
        System.out.println("inputAndCreateOutput 1回目の呼び出し:" + (String) ois.readObject());
//        System.out.println("inputAndCreateOutput 2回目の呼び出し:" + (String) ois.readObject()); // java.io.EOFException
        System.out.println("inputAndCreateOutput 2回目の呼び出し:" + inputStreemToString(bais)); // NULL
    }

    private static void inputMark() throws Exception {
        InputStream bais = new ByteArrayInputStream("あいうえおかきくけこ".getBytes("UTF-8"));
        bais.mark(1024);
        System.out.println("inputMark 1回目の呼び出し:" + inputStreemToString(bais));
        bais.reset();
        System.out.println("inputMark 2回目の呼び出し:" + inputStreemToString(bais)); // NULL
    }

    private static String inputStreemToString(InputStream in) throws IOException{
        return new BufferedReader(new InputStreamReader(in, "UTF-8")).readLine();
    }
}
