
export function a11yProps(index: number, tabsName = 'simple') {
    return {
        id: `${tabsName}-tab-${index}`,
        'aria-controls': `${tabsName}-tabpanel-${index}`,
    };
}

export function CustomTabPanel(props: {
    children?: React.ReactNode;
    index: number;
    value: number;
    tabsName?: string;
}) {
    const { children, value, index, tabsName = 'simple' } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`${tabsName}-tabpanel-${index}`}
            aria-labelledby={`${tabsName}-tab-${index}`}
        >
            {value === index && (
                <>{children}</>
            )}
        </div>
    );
}