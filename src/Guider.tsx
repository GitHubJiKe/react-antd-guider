import { Popover, Button, PopoverProps, Space } from "antd";
import React, { cloneElement, isValidElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { CloseOutlined } from "@ant-design/icons";

export interface GuiderStep extends PopoverProps {
  /** 锚点节点Id */
  anchorPointId: string;
  /** 下一步按钮 or 文案 */
  nextText?: React.ReactNode;
  /** 关闭按钮 or 文案 */
  closeText?: React.ReactNode;
  /** 上一步按钮 or 文案 */
  previousText?: React.ReactNode;
}

export interface GuiderHandler {
  open: () => void;
  close: () => void;
  previous: () => void;
}

const maskUniqueId = "guider-unique-mask-id";
const popoverUniqueId = "popover-unique-id";
const maskClassName = "ant-modal-mask";

export default function Guider(
  configs: GuiderStep[],
  mask = true
): GuiderHandler {
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
    if (status && visible) {
      return;
    }
    const conf: GuiderStep = configs[step];
    status = visible;
    const {
      title,
      content,
      anchorPointId,
      nextText,
      closeText,
      previousText,
      ...props
    } = conf;
    let container = document.getElementById(anchorPointId);
    let newRoot, maskNode;

    if (visible) {
      newRoot = document.createElement("div");
      if (mask) {
        container?.style.setProperty("z-index", "1001");
        maskNode = document.createElement("div");
        maskNode.id = maskUniqueId;
        maskNode.className = maskClassName;
        document.body.appendChild(maskNode);
      }
      newRoot.id = popoverUniqueId;
      container?.appendChild(newRoot);
    } else {
      newRoot = document.getElementById(popoverUniqueId);
      maskNode = document.getElementById(maskUniqueId);
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

    const len = configs.length - 1;

    const previousBtn = isValidElement(previousText) ? (
      cloneElement(previousText, { onClick: previous })
    ) : (
      <Button size="small" onClick={previous}>
        {previousText || "Previous"}
      </Button>
    );

    const nextBtn = isValidElement(nextText) ? (
      cloneElement(nextText, { onClick: next })
    ) : (
      <Button size="small" onClick={next} type="primary">
        {nextText || "Next"}
      </Button>
    );

    const closeBtn = isValidElement(closeText) ? (
      cloneElement(closeText, { onClick: close })
    ) : (
      <Button onClick={close} size="small" type="primary">
        {closeText || "Close"}
      </Button>
    );

    const _content = (
      <div>
        {content}
        <footer style={{ textAlign: "right", marginTop: 8 }}>
          <Space>
            {step > 0 && step <= len && previousBtn}
            {step < len && nextBtn}
            {step === len && closeBtn}
          </Space>
        </footer>
      </div>
    );

    if (!visible) {
      if (mask && maskNode) {
        container?.style.setProperty("z-index", "");
        document.body.removeChild(maskNode);
      }

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
