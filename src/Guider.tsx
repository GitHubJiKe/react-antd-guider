import { Popover, Button, PopoverProps, Space } from "antd";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";

export interface GuiderStep extends PopoverProps {
  containerId: string;
  nextText?: string;
  closeText?: string;
  previousText?: string;
}

export interface GuiderHandler {
  open: () => void;
  close: () => void;
  previous: () => void;
}

export default function Guider(configs: GuiderStep[]): GuiderHandler {
  let step = 0;
  let status: boolean = false;

  function next() {
    close();
    step++;
    open();
  }

  function previous() {
    close();
    step--;
    open();
  }

  function close() {
    if (!status) {
      return;
    }
    open(false);
  }

  function open(visible = true) {
    const conf: GuiderStep = configs[step];
    status = visible;
    const {
      title,
      content,
      containerId,
      nextText,
      closeText,
      previousText,
      ...props
    } = conf;
    let container = document.getElementById(containerId);
    let newRoot;

    if (visible) {
      newRoot = document.createElement("div");
      newRoot.id = "popover-unique-id";
      container?.appendChild(newRoot);
    } else {
      newRoot = document.getElementById("popover-unique-id");
    }

    const _title = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <CloseOutlined onClick={close} />
      </div>
    );

    const _content = (
      <div>
        {content}
        <footer style={{ textAlign: "right", marginTop: 8 }}>
          <Space>
            {step > 0 && step <= configs.length - 1 && (
              <Button size="small" onClick={previous}>
                {previousText || "previous"}
              </Button>
            )}
            {step < configs.length - 1 && (
              <Button size="small" onClick={next} type="primary">
                {nextText || "next"}
              </Button>
            )}
            {step === configs.length - 1 && (
              <Button onClick={close} size="small" type="primary">
                {closeText || "close"}
              </Button>
            )}
          </Space>
        </footer>
      </div>
    );

    if (!visible) {
      container?.removeChild(newRoot!);
      unmountComponentAtNode(newRoot!);
    } else {
      render(
        <Popover
          visible={visible}
          title={_title}
          content={_content}
          {...props}
        />,
        newRoot!
      );
    }
  }

  return {
    open: () => {
      step = 0;
      open();
    },
    close,
    previous,
  };
}
