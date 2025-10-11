/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "@components/settings/headerCard.css";
import "@components/settings/styles.css";

import { Settings, useSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { FolderIcon, GithubIcon, PaintbrushIcon, RestartIcon } from "@components/index";
import { NxCard, NxText } from "@components/NxComponents";
import { NxMascot } from "@components/settings/Mascot";
import { QuickAction, QuickActionContainer } from "@components/settings/QuickAction";
import { SpecialCard } from "@components/settings/SpecialCard";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { openPluginModal } from "@components/settings/tabs/plugins/PluginModal";
import { BackupAndRestoreTab } from "@components/settings/tabs/sync/BackupAndRestoreTab";
import { gitRemote } from "@shared/vencordUserAgent";
import { IS_MAC, IS_WINDOWS } from "@utils/constants";
import { openInviteModal } from "@utils/discord";
import { Margins } from "@utils/margins";
import { classes, isPluginDev } from "@utils/misc";
import { closeAllModals } from "@utils/modal";
import { relaunch } from "@utils/native";
import { Alerts, Button, FluxDispatcher, Forms, GuildStore, NavigationRouter, React, UserStore } from "@webpack/common";

import { VibrancySettings } from "./MacVibrancySettings";

const cl = classNameFactory("vc-settings-");

const CONTRIB_IMAGE = "https://cdn.discordapp.com/emojis/1337858798664024156.png";
const CONTRIB_BACKGROUND_IMAGE = "https://media.discordapp.net/stickers/1337878381517078649.png?size=2048";

type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function Switches() {
    const settings = useSettings(["useQuickCss", "enableReactDevtools", "frameless", "winNativeTitleBar", "transparent", "winCtrlQ", "disableMinSize"]);

    const Switches = [
        {
            key: "useQuickCss",
            title: "Enable Custom CSS",
        },
        !IS_WEB && {
            key: "enableReactDevtools",
            title: "Enable React Developer Tools",
            restartRequired: true
        },
        !IS_WEB && (!IS_DISCORD_DESKTOP || !IS_WINDOWS ? {
            key: "frameless",
            title: "Disable the window frame",
            restartRequired: true
        } : {
            key: "winNativeTitleBar",
            title: "Use Windows' native title bar instead of Discord's custom one",
            restartRequired: true
        }),
        !IS_WEB && {
            key: "transparent",
            title: "Enable window transparency",
            description: "A theme that supports transparency is required or this will do nothing. Stops the window from being resizable as a side effect",
            restartRequired: true
        },
        IS_DISCORD_DESKTOP && {
            key: "disableMinSize",
            title: "Disable minimum window size",
            restartRequired: true
        },
        !IS_WEB && IS_WINDOWS && {
            key: "winCtrlQ",
            title: "Register Ctrl+Q as shortcut to close Discord (Alternative to Alt+F4)",
            restartRequired: true
        },
    ] satisfies Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        title: string;
        description?: string;
        restartRequired?: boolean;
    }>;

    return Switches.map(setting => {
        if (!setting) {
            return null;
        }

        const { key, title, description, restartRequired } = setting;

        return (
            <FormSwitch
                key={key}
                title={title}
                description={description}
                value={settings[key]}
                onChange={v => {
                    settings[key] = v;

                    if (restartRequired) {
                        Alerts.show({
                            title: "Restart Required",
                            body: "A restart is required to apply this change",
                            confirmText: "Restart now",
                            cancelText: "Later!",
                            onConfirm: relaunch
                        });
                    }
                }}
            />
        );
    });
}

function VencordSettings() {
    const { showHint, hideContributorCard } = Settings.plugins.Settings;

    const needsVibrancySettings = IS_DISCORD_DESKTOP && IS_MAC;

    const user = UserStore?.getCurrentUser();

    return (
        <SettingsTab title="Nexulien Settings">
            <HeaderCard />

            {isPluginDev(user?.id) && !hideContributorCard && (
                <SpecialCard
                    title="Contributions"
                    subtitle="Thank you for contributing!"
                    description="Since you've contributed to Nexulien, you now have a cool new badge!"
                    cardImage={CONTRIB_IMAGE}
                    backgroundImage={CONTRIB_BACKGROUND_IMAGE}
                    backgroundGradient="linear-gradient(to left, var(--nx-green), var(--nx-purple))"
                />
            )}

            <section>
                <QuickActionContainer title="Quick Actions" columns="2">
                    <QuickAction
                        Icon={PaintbrushIcon}
                        text="Edit QuickCSS"
                        action={() => VencordNative.quickCss.openEditor()}
                    />
                    {!IS_WEB && (<>
                        <QuickAction
                            Icon={RestartIcon}
                            text="Relaunch Discord"
                            action={relaunch}
                        />
                        <QuickAction
                            Icon={FolderIcon}
                            text="Settings Folder"
                            action={() => VencordNative.settings.openFolder()}
                        />
                    </>
                    )}
                    <QuickAction
                        Icon={GithubIcon}
                        text="View Source Code"
                        action={() => VencordNative.native.openExternal("https://github.com/" + gitRemote)}
                    />
                </QuickActionContainer>
            </section>

            <Divider />

            <section className={Margins.top16}>
                <Forms.FormTitle tag="h5">Settings</Forms.FormTitle>
                {showHint ?
                    <NxCard variant="help" size="small" className={Margins.bottom16}>
                        <NxText size="small">
                            If you'd like to change the position of the Nexulien section, change the header card size, or just hide this hint, you can do so in the
                            {" "}<a onClick={() => openPluginModal(Vencord.Plugins.plugins.Settings)}>
                                settings of the Settings plugin
                            </a>!
                        </NxText>
                    </NxCard> : <></>
                }

                <Switches />
            </section>

            {needsVibrancySettings && <VibrancySettings />}
            {BackupAndRestoreTab()}
        </SettingsTab>
    );
}

function nexulien() {
    const audioElement = document.createElement("audio");
    const logo = document.getElementById("vc-settings-logo");

    const audioArray = [
        "https://raw.githubusercontent.com/Nexulien/Assets/main/tts/bonzi.wav", // 🟣🐒
        "https://raw.githubusercontent.com/Nexulien/Assets/main/tts/car.wav", // 🔷🐈
        "https://raw.githubusercontent.com/Nexulien/Assets/main/tts/kinito.wav", // 🌊🏄‍♀️
        "https://raw.githubusercontent.com/Nexulien/Assets/main/tts/paul.wav", // 🌑🚀
        "https://raw.githubusercontent.com/Nexulien/Assets/main/tts/teto.wav" // 🔻🎤
    ];

    audioElement.src = audioArray[Math.floor(Math.random() * audioArray.length)];
    audioElement.volume = 0.5;
    audioElement.play();
    window.setTimeout(function () {
        logo!.style = "animation: vc-settings-logo-boioioing 0.4s cubic-bezier(0.215, 0.610, 0.355, 1);";
    }, 200);
    window.setTimeout(function () {
        logo!.removeAttribute("style");
    }, 800);
}

function HeaderCard() {
    const [headerCardSize, setHeaderCardSize] = React.useState(Settings.plugins.Settings.headerCardSize);

    // I know it's ugly but I'm REALLY stupid.
    // TODO: Don't bruteforce checking for updates.
    React.useEffect(() => {
        const interval = setInterval(() => {
            const newSize = Settings.plugins.Settings.headerCardSize;
            setHeaderCardSize(prev => (prev !== newSize ? newSize : prev));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {headerCardSize !== "none" &&
                <NxCard className={classes(cl("card", "header", headerCardSize === "minimal" && "header-minimal"), "nx-card-grand")}>
                    <div>
                        <span className={cl("logo-container")} onClick={() => nexulien()}>
                            <svg width="250" height="50" viewBox="0 0 250 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={cl("logo")} id={cl("logo")}>
                                <path d="M15.3596 13.8152C26.3784 13.8152 30.7191 22.2959 30.7191 28.246V48.6269H22.7055V28.4512C22.7055 23.5953 19.2329 21.4068 15.3596 21.4068C11.4863 21.4068 8.01369 23.5953 8.01369 28.4512V48.6269H0V28.246C0 22.2959 4.34075 13.8152 15.3596 13.8152Z" fill="var(--header-primary)" />
                                <path d="M45.9806 26.7414H62.7426C61.3402 23.3901 58.3351 21.4752 54.3282 21.4752C50.3882 21.4752 47.383 23.3901 45.9806 26.7414ZM54.3282 41.7193C57.6673 41.7193 60.2717 40.4198 61.8745 38.0261H70.6227C68.419 44.9337 62.4755 49.2424 54.395 49.2424C44.044 49.2424 37.0988 42.1296 37.0988 31.5288C37.0988 20.9964 44.044 13.952 54.395 13.952C64.746 13.952 71.6244 20.9964 71.6244 31.5288C71.6244 32.4863 71.5577 33.3754 71.4909 34.2645H45.3796C46.2478 38.9836 49.5868 41.7193 54.3282 41.7193Z" fill="var(--header-primary)" />
                                <path d="M85.0411 31.5288L74.0223 14.4308H83.238L89.7825 24.5528L96.3271 14.4308H105.543L94.524 31.5288L105.543 48.6269H96.3271L89.7825 38.5048L83.238 48.6269H74.0223L85.0411 31.5288Z" fill="var(--header-primary)" />
                                <path d="M126.591 49.2424C115.572 49.2424 111.232 40.7618 111.232 34.8116V14.4308H119.245V34.6065C119.245 39.3939 122.718 41.6509 126.591 41.6509C130.465 41.6509 133.937 39.3939 133.937 34.6065V14.4308H141.951V34.8116C141.951 40.7618 137.61 49.2424 126.591 49.2424Z" fill="var(--header-primary)" />
                                <path d="M148.939 48.6269V0.752313H156.953V48.6269H148.939Z" fill="var(--header-primary)" />
                                <path d="M163.877 4.51389C163.877 2.05176 165.814 0 168.285 0C170.756 0 172.692 2.05176 172.692 4.51389C172.692 7.11279 170.756 9.09617 168.285 9.09617C165.814 9.09617 163.877 7.11279 163.877 4.51389ZM164.278 48.6269V14.4308H172.292V48.6269H164.278Z" fill="var(--header-primary)" />
                                <path d="M187.238 26.7414H204C202.597 23.3901 199.592 21.4752 195.585 21.4752C191.645 21.4752 188.64 23.3901 187.238 26.7414ZM195.585 41.7193C198.924 41.7193 201.529 40.4198 203.131 38.0261H211.88C209.676 44.9337 203.732 49.2424 195.652 49.2424C185.301 49.2424 178.356 42.1296 178.356 31.5288C178.356 20.9964 185.301 13.952 195.652 13.952C206.003 13.952 212.881 20.9964 212.881 31.5288C212.881 32.4863 212.815 33.3754 212.748 34.2645H186.637C187.505 38.9836 190.844 41.7193 195.585 41.7193Z" fill="var(--header-primary)" />
                                <path d="M234.64 13.8152C245.659 13.8152 250 22.2959 250 28.246V48.6269H241.986V28.4512C241.986 23.5953 238.514 21.4068 234.64 21.4068C230.767 21.4068 227.295 23.5953 227.295 28.4512V48.6269H219.281V28.246C219.281 22.2959 223.622 13.8152 234.64 13.8152Z" fill="var(--header-primary)" />
                            </svg>
                        </span>

                        {headerCardSize === "default" ? <NxText>
                            {/*                  ↓ Factual Information               */}
                            <span>...the best (worst) discord client mod.</span><br /><br />
                            <span>Nexulien doesn't need donations! Please go support <a href="https://github.com/sponsors/Vendicated" target="_blank" rel="noreferrer">Vendicated</a> instead!</span>
                        </NxText> : <></>}

                        <div className={cl("buttonRow", headerCardSize === "minimal" && "buttonRow-minimal")}>
                            <Button
                                size={headerCardSize === "minimal" ? Button.Sizes.SMALL : Button.Sizes.MEDIUM}
                                onClick={() => window.open("https://github.com/Nexulien")}
                            >Contribute</Button>
                            <Button
                                size={headerCardSize === "minimal" ? Button.Sizes.SMALL : Button.Sizes.MEDIUM}
                                onClick={async () => {
                                    if (!GuildStore.getGuild("1297010632591278090")) {
                                        const inviteAccepted = await openInviteModal("VS2wePpjnt");
                                        if (inviteAccepted) {
                                            closeAllModals();
                                            FluxDispatcher.dispatch({ type: "LAYER_POP_ALL" });
                                        }
                                    } else {
                                        FluxDispatcher.dispatch({ type: "LAYER_POP_ALL" });
                                        NavigationRouter.transitionToGuild("1297010632591278090");
                                    }
                                }}
                            >Join our Server</Button>
                        </div>
                    </div>

                    {headerCardSize === "default" && <NxMascot />}
                </NxCard>
            }
        </>
    );
}

export default wrapTab(VencordSettings, "Nexulien Settings");
