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

package com.thoughtworks.go.server.service.plugins.processor.configrepo;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.thoughtworks.go.plugin.configrepo.contract.material.CRScmMaterial;

public class BranchContext {
    private static final String SANITIZE = "[^a-zA-Z0-9\\-_]";

    public BranchContext(String fullRefName, String branchName, CRScmMaterial repo) {
        this.fullRefName = fullRefName;
        this.branchName = branchName;
        this.sanitizedBranchName = branchName.replaceAll(SANITIZE, "_");
        this.repo = repo;
    }

    @Expose
    @SerializedName("full_ref_name")
    private String fullRefName;

    @Expose
    @SerializedName("branch_name")
    private String branchName;

    @Expose
    @SerializedName("sanitized_branch_name")
    private String sanitizedBranchName;

    @Expose
    private CRScmMaterial repo;
}
