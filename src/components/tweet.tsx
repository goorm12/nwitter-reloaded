import styled from "styled-components";
import { Itweet } from "./timeline";
import { auth, db, storage } from "../routes/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import Modal from "./modal";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const BtnWrapper = styled.div`
  display: flex;
  gap: 10px;
`;
const DeleteBtn = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const EditBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
export default function Tweet({ username, photo, tweet, userId, id }: Itweet) {
  const [open, setOpen] = useState(false);
  const user = auth.currentUser;
  const handleDelete = async () => {
    const ok = confirm("정말로 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const handleEdit = () => {
    setOpen(!open);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <BtnWrapper>
            <DeleteBtn onClick={handleDelete}>삭제</DeleteBtn>
            <EditBtn onClick={handleEdit}>삭제</EditBtn>
          </BtnWrapper>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
      <Modal isOpen={open} onClose={() => setOpen(false)}></Modal>
    </Wrapper>
  );
}
