import React, { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

const MobileHeader: React.FC = () => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState("1")

    const tabs = [
        { key: "1", label: "For You" },
        { key: "2", label: "Following" },
        { key: "3", label: "Friend" },
    ]

    return (
        <div className="fixed w-screen z-40">
            <div className={`fixed w-full max-h-12 top-2 py-4 flex justify-evenly items-center`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`flex flex-col justify-center items-center px-4 py-2
                             ${activeTab === tab.key
                                ? `${theme === "light" ? "text-neutral-700" : " text-neutral-200 "}`
                                : `${theme === "light" ? "text-neutral-400 " : "text-neutral-600 "}`
                            }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span className='text-base font-bold'>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileHeader;