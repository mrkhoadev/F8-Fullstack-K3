export const color = (ParentComponent) => {
    const Component = (props) => {
        const color = '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0')
        return (
            <div style={{color}}>
                <ParentComponent {...props} />
            </div>
        );
    };
    return Component;
};
