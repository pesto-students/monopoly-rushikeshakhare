import * as React from "react";
import { mount } from "enzyme";
import { Toast } from "./Toast";

const ToastProps = {
  message: "Test Message",
};

describe("TOAST", () => {
  const TestComponent = (TimerProps) => {
    return mount(<Toast {...TimerProps} />);
  };
  it("should contain a toast", () => {
    const wrapper = TestComponent(ToastProps);
    expect(wrapper.find(".toast").exists()).toBeTruthy();
  });

  it("should contain a toast with same message as message prop ", () => {
    const wrapper = TestComponent(ToastProps);
    expect(wrapper.find(".toast").text()).toEqual(ToastProps.message);
  });
});
