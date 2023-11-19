import { forwardRef } from "react"

const Image = (props, ref) => {
    return <div>
        <img ref={ref} src="https://picsum.photos/200" alt="" />
    </div>
}
export default forwardRef(Image)