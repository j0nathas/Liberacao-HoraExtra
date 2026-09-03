export default function Loading() {
    return (
        <aside className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
            </div>
        </aside>
    )
}