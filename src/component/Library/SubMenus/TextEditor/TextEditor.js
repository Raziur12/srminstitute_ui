import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorStateChange = (newState) => {
    setEditorState(newState);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", position: "relative" }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "image",
            "remove",
            "history",
          ],
          inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
            inDropdown: true,
          },
          fontSize: {
            options: [
              "8",
              "10",
              "12",
              "14",
              "16",
              "18",
              "20",
              "24",
              "30",
              "36",
              "48",
              "60",
              "72",
              "96",
            ],
            inDropdown: true,
          },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Impact",
              "Tahoma",
              "Times New Roman",
              "Verdana",
            ],
            inDropdown: true,
          },
          list: { options: ["unordered", "ordered"], inDropdown: true },
          textAlign: { options: ["left", "center", "right", "justify"] },
          colorPicker: {},
          link: {},
          emoji: {},
          image: {},
          history: {},
        }}
        wrapperStyle={{ border: "1px solid #ddd", padding: "10px" }}
        editorStyle={{ minHeight: "200px", padding: "10px" }}
        toolbarStyle={{ position: "relative", zIndex: 10000 }}
      />
    </div>
  );
};

export default RichTextEditor;
