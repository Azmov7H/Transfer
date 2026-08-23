'use client';

export function TabHeader({ icon: Icon, title, description }) {
    return (
        <div className="flex flex-col gap-2 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tight uppercase tracking-widest">{title}</h2>
            </div>
            <p className="text-sm font-bold text-white/30 mr-[3.5rem] italic">{description}</p>
        </div>
    );
}
