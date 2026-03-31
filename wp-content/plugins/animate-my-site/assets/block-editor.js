(function (wp) {
    const { hooks, compose, components, i18n, blockEditor } = wp;
    const { createHigherOrderComponent } = compose;
    const { ToggleControl, PanelBody, PanelRow } = components;
    const { InspectorControls } = blockEditor;
    const { addFilter } = hooks;
    const { __ } = i18n;

    // 1. Add 'animmysiteDisable' attribute to all blocks
    function addDisableAttribute(settings) {
        if (typeof settings.attributes !== 'undefined') {
            settings.attributes = Object.assign(settings.attributes, {
                animmysiteDisable: {
                    type: 'boolean',
                    default: false,
                },
            });
        }
        return settings;
    }
    addFilter(
        'blocks.registerBlockType',
        'animmysite/add-disable-attribute',
        addDisableAttribute
    );

    // 2. Add Toggle Control to Inspector
    const withInspectorControl = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            const { attributes, setAttributes, isSelected, name } = props;
            const { animmysiteDisable } = attributes;

            // Mapping block types to setting keys
            const blockMap = {
                'core/image': 'images',
                'core/heading': 'headings',
                'core/paragraph': 'paragraphs',
                'core/list': 'lists',
                'core/quote': 'quotes',
                'core/quote': 'quotes',
            };

            // Check if this block should have the control
            const settingKey = blockMap[name];

            // If unknown block type, don't show control
            if (!settingKey) {
                return wp.element.createElement(BlockEdit, props);
            }

            // If matched block type, check if enabled in admin settings
            const settings = window.ANIMMYSITE_ADMIN_SETTINGS || {};
            const elements = settings.elements || {};

            // If not enabled globally, don't show control
            if (!elements[settingKey]) {
                return wp.element.createElement(BlockEdit, props);
            }

            return wp.element.createElement(
                wp.element.Fragment,
                {},
                wp.element.createElement(BlockEdit, props),
                isSelected && wp.element.createElement(
                    InspectorControls,
                    {},
                    wp.element.createElement(
                        PanelBody,
                        { title: __('Animate My Site', 'animate-my-site'), initialOpen: false },
                        wp.element.createElement(
                            PanelRow,
                            {},
                            wp.element.createElement(ToggleControl, {
                                label: __('Disable Animation', 'animate-my-site'),
                                checked: !!animmysiteDisable,
                                onChange: (val) => setAttributes({ animmysiteDisable: val }),
                                help: animmysiteDisable ? __('Animations are disabled for this element.', 'animate-my-site') : __('Animations are enabled for this element.', 'animate-my-site'),
                            })
                        )
                    )
                )
            );
        };
    }, 'withInspectorControl');

    addFilter(
        'editor.BlockEdit',
        'animmysite/with-inspector-control',
        withInspectorControl
    );

    // 3. Add 'animmysite-disabled' class to the block wrapper in the editor (and frontend save)
    function addDisableClass(extraProps, blockType, attributes) {
        const { animmysiteDisable } = attributes;

        if (animmysiteDisable) {
            extraProps.className = (extraProps.className || '') + ' animmysite-disabled';
        }

        return extraProps;
    }
    addFilter(
        'blocks.getSaveContent.extraProps',
        'animmysite/add-disable-class',
        addDisableClass
    );

    // 4. Document Sidebar Panel for Per-Page Settings
    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { useSelect, useDispatch } = wp.data;

    const AnimmysitePageSettings = () => {
        const meta = useSelect((select) =>
            select('core/editor').getEditedPostAttribute('meta') || {}
        );
        const { editPost } = useDispatch('core/editor');

        return wp.element.createElement(
            PluginDocumentSettingPanel,
            {
                name: 'animmysite-page-settings',
                title: __('Animate My Site', 'animate-my-site'),
                icon: 'dashicons-performance',
            },
            wp.element.createElement(ToggleControl, {
                label: __('Disable Animations on this page', 'animate-my-site'),
                checked: !!meta._animmysite_disable_animation,
                onChange: (value) => {
                    editPost({ meta: { ...meta, _animmysite_disable_animation: value } });
                },
                help: meta._animmysite_disable_animation
                    ? __('Animations are disabled for this entire page.', 'animate-my-site')
                    : __('Animations are enabled for this page.', 'animate-my-site'),
            })
        );
    };

    registerPlugin('animmysite-page-settings-plugin', {
        render: AnimmysitePageSettings,
        icon: 'dashicons-performance',
    });

})(window.wp);

