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

import * as _ from "lodash";
import m from "mithril";
import {Material} from "models/new_pipeline_configs/materials";
import * as Buttons from "views/components/buttons";
import {Modal, Size} from "views/components/modal";
import {MaterialEditor} from "./material_editor";

export class AddMaterialModal extends Modal {
  private readonly material: Material;
  private readonly onSuccessfulAdd: (material: Material) => void;

  constructor(material: Material, onSuccessfulAdd: (material: Material) => void) {
    super(Size.large);
    this.material        = material;
    this.onSuccessfulAdd = onSuccessfulAdd;
  }

  body(): m.Children {
    return <MaterialEditor material={this.material}/>;
  }

  title(): string {
    const materialAttributes = this.material.attributes();
    if (_.isUndefined(materialAttributes) || _.isEmpty(materialAttributes.name())) {
      return "Add material";
    }

    const materialName = materialAttributes.name();
    return _.isUndefined(materialName) ? "" : materialName;
  }

  buttons(): m.ChildArray {
    return [
      <Buttons.Primary data-test-id="button-ok" onclick={this.addMaterial.bind(this)}>Add</Buttons.Primary>
    ];
  }

  addMaterial(): void {
    if (this.material.isValid()) {
      this.close();
      const materialAttributes = this.material.attributes();
      if (!_.isUndefined(materialAttributes)) {
        if (_.isEmpty(materialAttributes.name())) {
          materialAttributes.name(this.material.materialUrl());
        } else {
          materialAttributes.name(materialAttributes.name());
        }
      }
      this.onSuccessfulAdd(this.material);
    }
  }
}
