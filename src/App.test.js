import "raf/polyfill";
import initStoryshots from "@storybook/addon-storyshots";

beforeEach(() => spyOn(console, "error"));
initStoryshots();
