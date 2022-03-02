import React from "react";
import { Divider } from "semantic-ui-react";

const GetListOfComments = (data) => {
  const res = data.List.map((ll, index) => {
    return (
      <li key={index} className="d-flex py-2">
        {console.log(ll)}
        <div
          style={{
            width: "5rem",
            minWidth: "3rem",
            height: "5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "5rem",
              flexDirection: 'column'
            }}
          >
            <div>{ll[0].Rating}</div>
            <div>Stars</div>
          </div>
        </div>
        <div className="ms-4" style={{ fontSize: "0.9rem" }}>
          <div>
            <span style={{ fontWeight: "500" }}>{ll[0].SuperChatGiver}</span> •{" "}
            <span style={{ fontSize: "0.85rem" }}> 3 Days ago</span>
          </div>
          <div style={{ fontWeight: "400" }}>{ll[0].Feedback}</div>
        </div>
      </li>
    );
  });

  return <ul className="m-0 p-0">{res}</ul>;
};

export default function CommentsSection(props) {
  return (
    <div>
      {!props.Comments || props.Comments.length === 0 ? (
        <span style={{ fontWeight: "500", fontSize: "1.1rem" }}>
          No Records Found
        </span>
      ) : (
        <GetListOfComments List={props.Comments} />
      )}
      {console.log(props.Comments)}
    </div>
  );
}
