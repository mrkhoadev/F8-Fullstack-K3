import React, { Children } from 'react'
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';


export default function SortableItem({data, children, classEL}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: data._id, data: { ...data } });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} className={classEL} {...(classEL !== 'column' && { ...listeners })}>
            {React.Children.map(children, (child) => {
                // Kiểm tra xem child có là div với class là "column-title" hay không
                const isColumnsTitle =
                    child.type === "div" &&
                    child.props.className === "column-title";

                // Thêm listeners nếu là "column-title"
                return isColumnsTitle
                    ? React.cloneElement(child, { ...listeners })
                    : child;
            })}
        </div>
    );
}
