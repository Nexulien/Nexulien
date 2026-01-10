/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled } from "@api/PluginManager";
import { Settings, useSettings } from "@api/Settings";
import { FolderIcon, PaintbrushIcon, PencilIcon, PlusIcon, RestartIcon } from "@components/Icons";
import { Link } from "@components/Link";
import { NxCard, NxText, NxTitle } from "@components/NxComponents";
import { QuickAction, QuickActionContainer } from "@components/settings/QuickAction";
import { openPluginModal } from "@components/settings/tabs/plugins/PluginModal";
import { UserThemeHeader } from "@main/themes";
import ClientThemePlugin from "@plugins/clientTheme";
import { classNameFactory } from "@utils/css";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { findLazy } from "@webpack";
import { Forms, useEffect, useRef, useState } from "@webpack/common";
import type { ComponentType, Ref, SyntheticEvent } from "react";

import { ThemeCard } from "./ThemeCard";

const cl = classNameFactory("vc-settings-theme-");

type FileInput = ComponentType<{
    ref: Ref<HTMLInputElement>;
    onChange: (e: SyntheticEvent<HTMLInputElement>) => void;
    multiple?: boolean;
    filters?: { name?: string; extensions: string[]; }[];
}>;

const FileInput: FileInput = findLazy(m => m.prototype?.activateUploadDialogue && m.prototype.setRef);

// When a local theme is enabled/disabled, update the settings
function onLocalThemeChange(fileName: string, value: boolean) {
    if (value) {
        if (Settings.enabledThemes.includes(fileName)) return;
        Settings.enabledThemes = [...Settings.enabledThemes, fileName];
    } else {
        Settings.enabledThemes = Settings.enabledThemes.filter(f => f !== fileName);
    }
}

async function onFileUpload(e: SyntheticEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (!e.currentTarget?.files?.length) return;
    const { files } = e.currentTarget;

    const uploads = Array.from(files, file => {
        const { name } = file;
        if (!name.endsWith(".css")) return;

        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                VencordNative.themes.uploadTheme(name, reader.result as string)
                    .then(resolve)
                    .catch(reject);
            };
            reader.readAsText(file);
        });
    });

    await Promise.all(uploads);
}

export function LocalThemesTab() {
    const settings = useSettings(["enabledThemes"]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userThemes, setUserThemes] = useState<UserThemeHeader[] | null>(null);

    useEffect(() => {
        refreshLocalThemes();
    }, []);

    async function refreshLocalThemes() {
        const themes = await VencordNative.themes.getThemesList();
        setUserThemes(themes);
    }

    return (
        <>
            <NxCard className={classes(cl("info-card"), Margins.bottom16)}>
                <NxTitle>Find Themes:</NxTitle>
                <div style={{ marginBottom: ".5em", display: "flex", flexDirection: "column" }}>
                    <ul>
                        <li>
                            &mdash;&nbsp;
                            <Link style={{ marginRight: ".5em" }} href="https://betterdiscord.app/themes">
                                BetterDiscord Themes
                            </Link>
                        </li>
                        <li>
                            &mdash;&nbsp;
                            <Link href="https://github.com/search?q=discord+theme">GitHub</Link>
                        </li>
                    </ul>
                </div>
                <NxText>If using the BD site, click on "Download" and place the downloaded <code className="nx-code-new">.theme.css</code> file into your themes folder.</NxText>
            </NxCard>

            <NxCard variant="help" className={Margins.bottom16}>
                <NxTitle>External Resources</NxTitle>
                <NxText>
                    For security reasons, loading resources (styles, fonts, images, ...) from most sites is blocked.
                    Make sure all your assets are hosted on GitHub, GitLab, Codeberg, Imgur, Discord or Google Fonts.
                </NxText>
            </NxCard>


            <section>
                <Forms.FormTitle tag="h5">Local Themes</Forms.FormTitle>
                <QuickActionContainer title="Manage Local Themes">
                    <>
                        {IS_WEB ?
                            (
                                <QuickAction
                                    text={
                                        <span style={{ position: "relative" }}>
                                            Upload Theme
                                            <FileInput
                                                ref={fileInputRef}
                                                onChange={async e => {
                                                    await onFileUpload(e);
                                                    refreshLocalThemes();
                                                }}
                                                multiple={true}
                                                filters={[{ extensions: ["css"] }]}
                                            />
                                        </span>
                                    }
                                    Icon={PlusIcon}
                                />
                            ) : (
                                <QuickAction
                                    text="Themes Folder"
                                    action={() => VencordNative.themes.openFolder()}
                                    Icon={FolderIcon}
                                />
                            )}
                        <QuickAction
                            text="Reload Themes"
                            action={refreshLocalThemes}
                            Icon={RestartIcon}
                        />
                        <QuickAction
                            text="Edit QuickCSS"
                            action={() => VencordNative.quickCss.openEditor()}
                            Icon={PaintbrushIcon}
                        />

                        {isPluginEnabled(ClientThemePlugin.name) && (
                            <QuickAction
                                text="Edit ClientTheme"
                                action={() => openPluginModal(ClientThemePlugin)}
                                Icon={PencilIcon}
                            />
                        )}
                    </>
                </QuickActionContainer>

                <div className={cl("grid")}>
                    {userThemes?.map(theme => (
                        <ThemeCard
                            key={theme.fileName}
                            enabled={settings.enabledThemes.includes(theme.fileName)}
                            onChange={enabled => onLocalThemeChange(theme.fileName, enabled)}
                            onDelete={async () => {
                                onLocalThemeChange(theme.fileName, false);
                                await VencordNative.themes.deleteTheme(theme.fileName);
                                refreshLocalThemes();
                            }}
                            theme={theme}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}
