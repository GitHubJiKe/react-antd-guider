import React, { useEffect, useRef } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Button } from "antd";
import Guider, { GuiderStep, GuiderHandler } from "./Guider";

const guiderConfigs: GuiderStep[] = [
  {
    title: "第一步",
    content: "第一步的内容",
    containerId: "btn1",
    placement: "bottomRight",
    nextText: "下一步",
    closeText: "关闭",
  },
  {
    title: "第二步",
    content: "第二步的内容",
    containerId: "btn2",
    placement: "bottomLeft",
    previousText: "上一步",
    nextText: "下一步",
  },
  {
    title: "第三步",
    content: "第三步的内容",
    containerId: "btn3",
    placement: "topRight",
    previousText: "上一步",
    nextText: "下一步",
  },
  {
    title: "第四步",
    content: "第四步的内容",
    containerId: "btn4",
    placement: "topLeft",
    previousText: "上一步",
    nextText: "下一步",
  },
  {
    title: "第五步",
    content: (
      <div>
        <h1>第五步的内容</h1>
        <article style={{ width: 300 }}>
          如何移除两个汉字之间的空格？# 根据 Ant Design
          设计规范要求，我们会在按钮内(文本按钮和链接按钮除外)只有两个汉字时自动添加空格，如果你不需要这个特性，可以设置
          ConfigProvider 的 autoInsertSpaceInButton 为 false。
        </article>
      </div>
    ),
    containerId: "btn5",
    previousText: "上一步",
    closeText: "知道了",
  },
];

function App() {
  const handlerRef = useRef<GuiderHandler>();
  useEffect(() => {
    handlerRef.current = Guider(guiderConfigs);
    handlerRef.current.open();
    return () => {
      handlerRef.current?.close();
    };
  }, []);
  return (
    <div className="App">
      <Button
        id="btn1"
        style={{ position: "absolute", top: 0, left: 0 }}
        onClick={() => {
          handlerRef.current?.open();
        }}
      >
        Step1 and reopen
      </Button>
      <Button id="btn2" style={{ position: "absolute", top: 0, right: 0 }}>
        Step2
      </Button>
      <Button
        id="btn3"
        style={{ position: "absolute", bottom: 0, left: 0 }}
        onClick={() => {
          handlerRef.current?.close();
        }}
      >
        Step3 and close
      </Button>
      <Button id="btn4" style={{ position: "absolute", bottom: 0, right: 0 }}>
        Step4
      </Button>
      <Button id="btn5">Step5</Button>
    </div>
  );
}

export default App;
