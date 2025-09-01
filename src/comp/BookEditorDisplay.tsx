export function BookEditorDisplay(props: {
    bookChapter: {
        line: string;
        type: string;
    }[];
}) {
    return props.bookChapter.map((bl) => {
        const style = {
            marginTop: "0px",
            marginBottom: "0px",
            minHeight: '20px'
        }

        if (bl.type === 'character') {
            const [speaker, ...restParts] = bl.line.split(":");
            const restString = restParts.join(":").trim();
            return <p style={style}><b>{speaker.trim()}</b>{restString ? `: ${restString}` : ""}</p>;
        }
        return <p style={style}><i>{bl.line}</i></p>;
    })
}