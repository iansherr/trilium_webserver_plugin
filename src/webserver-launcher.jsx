import { ActionButton, defineLauncherWidget, h } from "trilium:preact";

const DASHBOARD_NOTE_ID = "_community_packages_iansherr_webserver_webserver_dashboard_render";

export default defineLauncherWidget({
    render: () => h(ActionButton, {
        text: "Web Server",
        icon: "bx bx-server",
        titlePosition: "right",
        onClick: () => void api.activateNote(DASHBOARD_NOTE_ID)
    })
});
