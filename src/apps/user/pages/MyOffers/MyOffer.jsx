import React, { useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiStar,
  FiUserPlus,
  FiSend
} from "react-icons/fi";
import {
  PageWrap,
  Section,
  Title,
  SubTitle,
  Grid,
  Card,
  CardHeader,
  Avatar,
  NameWrap,
  Name,
  Role,
  Time,
  CardBody,
  PostTitle,
  PostDesc,
  Thumb,
  CardFooter,
  Actions,
  ActionBtn,
  Rating,
  FollowBtn,
  InlineBox,
  InlineInput,
  InlineComment,
  StarsRow,
  StarBtn,
  SendBtn
} from "./MyOffer.styles";

const posts = [
  {
    id: 1,
    expert: "Rahul Sharma",
    role: "Senior Tech Analyst",
    avatar: "https://i.pravatar.cc/150?img=12",
    time: "2h ago",
    title: "50% Off on Advanced AI Course",
    desc: "Master machine learning with industry experts.",
    image: "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg",
    likes: 120,
    comments: ["Very helpful", "Looks interesting"],
    rating: 4.6,
    reviews: 86
  }
];

export default function MyOffer() {
  const [liked, setLiked] = useState({});
  const [openComment, setOpenComment] = useState(null);
  const [openRating, setOpenRating] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState({});
  const [following, setFollowing] = useState({});

  const renderCard = (post, showFollow = false) => (
    <Card key={post.id}>
      <CardHeader>
        <Avatar src={post.avatar} />
        <NameWrap>
          <Name>{post.expert}</Name>
          <Role>{post.role}</Role>
        </NameWrap>
        <Time>{post.time}</Time>
      </CardHeader>

      <CardBody>
        <PostTitle>{post.title}</PostTitle>
        <PostDesc>{post.desc}</PostDesc>
        <Thumb src={post.image} />
      </CardBody>

      <CardFooter>
        <Actions>
          <ActionBtn
            liked={liked[post.id]}
            onClick={() =>
              setLiked((p) => ({ ...p, [post.id]: !p[post.id] }))
            }
          >
            <FiHeart />
            {liked[post.id] ? post.likes + 1 : post.likes}
          </ActionBtn>

          <ActionBtn
            onClick={() =>
              setOpenComment(openComment === post.id ? null : post.id)
            }
          >
            <FiMessageCircle /> {post.comments.length}
          </ActionBtn>

          <Rating
            onClick={() =>
              setOpenRating(openRating === post.id ? null : post.id)
            }
          >
            <FiStar /> {post.rating} ({post.reviews})
          </Rating>
        </Actions>

        {showFollow && (
          <FollowBtn
            followed={following[post.id]}
            onClick={() =>
              setFollowing((p) => ({ ...p, [post.id]: !p[post.id] }))
            }
          >
            {following[post.id] ? "Following" : (
              <>
                <FiUserPlus size={14} /> Follow
              </>
            )}
          </FollowBtn>
        )}
      </CardFooter>

      {/* Inline Comments */}
      {openComment === post.id && (
        <InlineBox>
          {post.comments.map((c, i) => (
            <InlineComment key={i}>{c}</InlineComment>
          ))}
          <InlineInput
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <SendBtn>
            <FiSend />
          </SendBtn>
        </InlineBox>
      )}

      {/* Inline Rating & Review */}
      {openRating === post.id && (
        <InlineBox>
          <StarsRow>
            {[1, 2, 3, 4, 5].map((s) => (
              <StarBtn
                key={s}
                active={userRating[post.id] >= s}
                onClick={() =>
                  setUserRating((p) => ({ ...p, [post.id]: s }))
                }
              >
                <FiStar />
              </StarBtn>
            ))}
          </StarsRow>
          <InlineInput placeholder="Write a review…" />
        </InlineBox>
      )}
    </Card>
  );

  return (
    <PageWrap>
      <Section>
        <Title>My Exclusive Offers</Title>
        <SubTitle>Posts from experts you follow</SubTitle>
        <Grid>{posts.map((p) => renderCard(p))}</Grid>
      </Section>

      <Section>
        <Title>Top Rated Experts</Title>
        <SubTitle>Highly rated experts you may like</SubTitle>
        <Grid>{posts.map((p) => renderCard(p, true))}</Grid>
      </Section>
    </PageWrap>
  );
}
