/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 *
 * Helper functions for Bootstrap components.
 */

function setButtonChecked(button, checked) {
    button.checked = checked;
    button.parentNode.classList.toggle("active", checked);
}

function toggleHidden(hidden) {
    let hiddenClass = "d-none";
    if (typeof hidden === "boolean") {
        for (let i = 1; i < arguments.length; i++) {
            arguments[i].classList.toggle(hiddenClass, hidden);
        }
    } else if (hidden) {
        hidden.classList.toggle(hiddenClass);
    }
}

function toggleDisabled(disabled) {
    if (typeof disabled === "boolean") {
        for (let i = 1; i < arguments.length; i++) {
            arguments[i].disabled = disabled;
        }
    } else if (disabled) {
        disabled.disabled = !disabled.disabled;
    }
}

function getSubPage(url) {
    let request = new Request(url, {
        method: "GET",
        headers: {
            "Content-Type": "text/xml"
        },
        mode: "same-origin",
        cache: "force-cache"
    });
    return fetch(request).then(response => {
        return response.text()
    }).then(text => {
        return document.createRange().createContextualFragment(text);
    });
}

function changeTab(tab) {
    let tabInfo = tab.split("#");
    let tabSelector = document.querySelector(".tab-selector[data-tab=" + tabInfo[0] + "]");
    if (!tabSelector || tabSelector.classList.contains("active")) {
        return;
    }
    document.getElementById("tabs").querySelector(".active").classList.remove("active");
    tabSelector.classList.add("active");
    document.querySelector(".tab-pane.active").classList.remove("active");
    document.getElementById(tabSelector.dataset.tab + "Tab").classList.add("active");

    document.title = browser.i18n.getMessage(tabSelector.dataset.tabTitle);
    document.getElementById("pageTitle").textContent = document.title;

    if (tabInfo[1]) {
        window.location.hash = tabInfo[1]
    }
}

function setTabFromHash() {
    let hash = window.location.hash;
    if (hash.startsWith("#tab-")) {
        changeTab(hash.substring(5));
    }
}

window.addEventListener("hashchange", setTabFromHash);

document.addEventListener("DOMContentLoaded", function () {
    setTabFromHash();
    for (let close of document.querySelectorAll(".alert .close")) {
        close.addEventListener("click", function () {
            this.parentNode.classList.remove("show");
        });
    }
    for (let btn of document.querySelectorAll('[data-toggle="modal"]')) {
        btn.addEventListener("click", function () {
            if (!document.querySelector(".modal-backdrop")) {
                let overlay = document.createElement("div");
                overlay.className = "modal-backdrop fade show";
                document.body.appendChild(overlay);
            }
            document.querySelector(this.dataset["target"]).classList.add("show");
        });
    }
    for (let close of document.querySelectorAll(".modal .close")) {
        close.addEventListener("click", function () {
            document.querySelector(".modal.show").classList.remove("show");
            document.body.removeChild(document.querySelector(".modal-backdrop"));
        });
    }

});
