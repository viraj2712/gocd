/*
 * Copyright 2019 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {asSelector} from "helpers/css_proxies";
import m from "mithril";
import {ExecTask, Task} from "models/new_pipeline_configs/task";
import * as simulateEvent from "simulate-event";
import {value} from "views/components/key_value_pair/index.scss";
import advancedSettingsStyles from "views/pages/pipeline_configs/advanced_settings/advanced_settings.scss";
import {TaskDescriptionWidget} from "views/pages/pipeline_configs/stages/on_create/task_description_widget";
import task_terminal_styles from "views/pages/pipeline_configs/stages/on_create/task_terminal.scss";
import styles from "views/pages/pipeline_configs/stages/on_create/tasks.scss";
import {TestHelper} from "views/pages/spec/test_helper";

describe("Pipeline Config - Job Settings Modal - Tasks Widget - Task Description", () => {
  const helper = new TestHelper();

  describe("Exec", () => {
    let task: ExecTask;
    let onCancelTask: Task;

    beforeEach(() => {
      task         = new ExecTask("ls foo");
      onCancelTask = new ExecTask("on cancel task") as Task;
      helper.mount(() => <TaskDescriptionWidget task={task} onCancelTask={onCancelTask}/>);
    });

    afterEach(() => {
      helper.unmount();
    });

    it("should render the task description", () => {
      expect(helper.findByDataTestId("exec-task-description")).toBeInDOM();
    });

    describe("Task Editor", () => {
      it("should render the task editor", () => {
        expect(helper.find("code")).toBeInDOM();
      });

      it("should represent the task in the task editor window", () => {
        expect(helper.find("pre")[0]).toHaveText(task.represent()!);
      });

      it("should update the task editor when task model is updated", () => {
        expect(helper.find("pre")[0]).toHaveText(task.represent()!);

        const updatedCommand = "ls -al";
        task.command(updatedCommand);
        m.redraw.sync();

        expect(helper.find("pre")[0]).toContainText(updatedCommand);
      });

      it("should render the caveats in the task editor", () => {
        expect(helper.findByDataTestId("caveats-container")).toBeInDOM();
        expect(helper.findByDataTestId("caveats-container")).toContainText("Caveats");
      });

      it("should display caveats description on click of expand icon", () => {
        const caveatsDesc = "This is not a real shell:";

        expect(helper.findByDataTestId("caveats-container")).not.toHaveClass(task_terminal_styles.open);

        simulateEvent.simulate(helper.findByDataTestId("caveats-toggle-btn")[0], "click");
        m.redraw.sync();

        expect(helper.findByDataTestId("caveats-container")).toHaveClass(task_terminal_styles.open);
        expect(helper.findByDataTestId("caveats-container")).toContainText(caveatsDesc);
      });

      it("should display editor instructions", () => {
        const caveatsInstructions = "# Press <enter> to save, <shift-enter> for newline";

        expect(helper.findByDataTestId("caveats-instructions")).toBeInDOM();
        expect(helper.findByDataTestId("caveats-instructions")).toContainText(caveatsInstructions);
      });
    });

    describe("run if conditions", () => {
      it("should render the run if conditions", () => {
        expect(helper.findByDataTestId("run-if-conditions-container")).toBeInDOM();
      });

      it("should render all run if condition options", () => {
        const runIfConditionsContainer = helper.findByDataTestId("run-if-conditions-container");

        expect(runIfConditionsContainer).toContainText("Run If Conditions");
        expect(runIfConditionsContainer).toContainText("Passed");
        expect(runIfConditionsContainer).toContainText("Failed");
        expect(runIfConditionsContainer).toContainText("Any");
      });

      it("should select passed by default", () => {
        expect(task.runIfCondition()).toBe("Passed");
        const passedRadioField = helper.findByDataTestId("input-field-for-Passed");
        expect(helper.findSelectorIn(passedRadioField, "label")).toContainText(task.runIfCondition());
        expect(helper.findSelectorIn(passedRadioField, "input")).toBeChecked();
      });

      it("should select another run if condition on click", () => {
        expect(task.runIfCondition()).toBe("Passed");
        const passedRadioField = helper.findByDataTestId("input-field-for-Passed");
        expect(helper.findSelectorIn(passedRadioField, "label")).toContainText(task.runIfCondition());
        expect(helper.findSelectorIn(passedRadioField, "input")).toBeChecked();

        let failedRadioField = helper.findByDataTestId("input-field-for-Failed");
        simulateEvent.simulate(helper.findSelectorIn(failedRadioField, "input")[0], "click");
        m.redraw.sync();

        failedRadioField = helper.findByDataTestId("input-field-for-Failed");
        expect(task.runIfCondition()).toBe("Failed");
        expect(helper.findSelectorIn(failedRadioField, "label")).toContainText(task.runIfCondition());
        expect(helper.findSelectorIn(failedRadioField, "input")).toBeChecked();

        let anyRadioField = helper.findByDataTestId("input-field-for-Any");
        simulateEvent.simulate(helper.findSelectorIn(anyRadioField, "input")[0], "click");
        m.redraw.sync();

        anyRadioField = helper.findByDataTestId("input-field-for-Any");
        expect(task.runIfCondition()).toBe("Any");
        expect(helper.findSelectorIn(anyRadioField, "label")).toContainText(task.runIfCondition());
        expect(helper.findSelectorIn(anyRadioField, "input")).toBeChecked();
      });
    });

    describe("Advanced Settings", () => {
      it("should render advance configuration section", () => {
        expect(helper.findByDataTestId("advance-settings-container")).toBeInDOM();
      });

      it("should toggle advanced settings on click of toggle button", () => {
        const sel = asSelector<typeof advancedSettingsStyles>(advancedSettingsStyles);

        const top = helper.q(sel.advancedSettings);
        expect(top.classList.contains(advancedSettingsStyles.open)).toBe(false);
        expect(top.classList.contains(advancedSettingsStyles.lockOpen)).toBe(false);
        expect(window.getComputedStyle(helper.q(sel.details, top)).display).toBe("none");

        helper.click(sel.summary, top);
        expect(top.classList.contains(advancedSettingsStyles.open)).toBe(true);
        expect(top.classList.contains(advancedSettingsStyles.lockOpen)).toBe(false);
        expect(window.getComputedStyle(helper.q(sel.details, top)).display).toBe("block");

        helper.click(sel.summary, top);
        expect(top.classList.contains(advancedSettingsStyles.open)).toBe(false);
        expect(top.classList.contains(advancedSettingsStyles.lockOpen)).toBe(false);
        expect(window.getComputedStyle(helper.q(sel.details, top)).display).toBe("none");
      });

      it("should render on cancel task checkbox", () => {
        expect(helper.findByDataTestId("on-cancel-task-checkbox")).toBeInDOM();
        expect(helper.findByDataTestId("on-cancel-task-checkbox")).toContainText("On Cancel Task");
      });

      it("should render new task editor on click of onCancelTask", () => {
        expect(helper.findByDataTestId("on-cancel-task-container")).not.toHaveClass(styles.show);
        expect(helper.findByDataTestId("on-cancel-task-input")).not.toBeChecked();

        simulateEvent.simulate(helper.findByDataTestId("on-cancel-task-checkbox")[0], "click");
        m.redraw.sync();

        expect(helper.findByDataTestId("on-cancel-task-input")).toBeChecked();
        expect(helper.find("code")[1]).toBeInDOM();
      });
    });
  });
});
