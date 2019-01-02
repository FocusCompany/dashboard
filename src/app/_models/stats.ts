export class Process {
    process: string;
    window: string;
    start: Date;
    end: Date;
    afk: boolean;
}

export class UserWindow {
    process: string;
    window: string;
    start: Date;
    end: Date;
    afk: boolean;
}

export class Dnd {
    UserId: string;
    Activations: number;
}
