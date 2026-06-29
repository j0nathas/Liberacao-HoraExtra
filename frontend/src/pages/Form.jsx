

export default function Form() {
    return (
        <>
            <main>
                <div>
                    <h1>Controle de Hora Extra</h1>
                    <p></p>
                </div>
                <form
                    style={{ all: 'unset' }}
                    className="flex flex-col w-max items-center self-center rounded-3xl p-14 bg-black shadow-2xl gap-36"
                >
                    <section className="flex w-max items-center flex-col rounded-3xl bg-gray-500 shadow-2xl">
                        <h2>Responsável pela solicitação</h2>
                        <div>
                            <label htmlFor="">Nome do responsável</label>
                            <input className="border-blue-500 border-2" type="text" name="responsável" id="" />
                        </div>
                        <div>
                            <label htmlFor="">E-mail do responsável</label>
                            <input className="border-blue-500 border-2" type="text" name="responsável" placeholder="exemplo@email.com" id="" />
                        </div>
                    </section>

                    <section className="rounded-3xl w-max bg-gray-500 shadow-2xl">
                        <h2>Responsável pela solicitação</h2>
                        <div>
                            <label htmlFor="">Nome do responsável</label>
                            <input className="border-blue-500 border-2" type="text" name="responsável" id="" />
                        </div>
                        <div>
                            <label htmlFor="">E-mail do responsável</label>
                            <input className="border-blue-500 border-2" type="text" name="responsável" placeholder="exemplo@email.com" id="" />
                        </div>
                    </section>

                </form>
            </main>
        </>
    )
}