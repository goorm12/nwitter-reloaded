import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../routes/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
  margin-bottom: 15px;
`;

const ErrorSpan = styled.span`
  color: red;
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size < 1048576) {
      setFile(files[0]);
      setError(null);
    } else {
      setError("파일은 1개만 선택할 수 있으며, 크기는 1MB 이하만 가능합니다.");
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anoymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }

      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <TextArea
          required
          rows={5}
          maxLength={180}
          onChange={handleChange}
          value={tweet}
          placeholder="무슨 일 이신가요?"
        />
        <AttachFileButton htmlFor="file">
          {file ? "사진 추가 완료 ✅" : "사진 추가하기"}
        </AttachFileButton>
        <AttachFileInput
          onChange={handleFileChange}
          type="file"
          id="file"
          accept="image/*"
        />
        <SubmitBtn type="submit" value={isLoading ? "게시중..." : "게시하기"} />
      </Form>
      {error && <ErrorSpan>{error}</ErrorSpan>}
    </>
  );
}
