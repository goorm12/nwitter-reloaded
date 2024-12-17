import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../routes/firebase";
import Tweet from "./tweet";

export interface Itweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweets] = useState<Itweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createAt", "desc")
    );

    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return { tweet, createAt, userId, username, photo, id: doc.id };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
