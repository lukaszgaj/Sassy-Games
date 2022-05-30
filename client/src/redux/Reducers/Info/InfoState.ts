import { ReactNode } from "react";

export interface InfoState {
    isModalVisible: boolean;
    message?: string;
    heading: string;
    children?: ReactNode;
}