import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export default class SaveButtonPlugin extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add("saveButton", locale => {
            const view = new ButtonView(locale);

            view.set({
                label: "Save",
                icon: "save",
                tooltip: true
            });

            // Execute your save logic here
            view.on("execute", () => {
                // Add your save logic here, for example:
                // console.log("Save button clicked!");
            });

            return view;
        });
    }
}