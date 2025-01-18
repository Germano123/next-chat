import classNames from "classnames";
import { ReactNode } from "react";

interface IContainer {
    width: string;
    height: string;
    classes: string;
    children: ReactNode;
}

export const Container = ({ width, height, classes, children }: IContainer) => {
    const containerClassnames = classNames(
        "border-2 border-dashed border-black",
        "rounded-[45px]",
        "shadow-xl",
        "bg-white",
        {
            [classes]: true,
        }
    );

    return (
        <div className={ `${ width } ${ height } ${ containerClassnames }` }>
            { children }
        </div>
    )
}
