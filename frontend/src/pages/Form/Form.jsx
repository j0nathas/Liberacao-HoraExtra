
import { useFormController } from './controllers/useFormController.js';
import FormView from './views/FormView.jsx';

export default function Form() {
    const controller = useFormController();

    return <FormView {...controller} />;
}