import { useParams, useNavigate } from 'react-router';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function ReviewBeforeSubmitPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-red-50/30 min-h-full py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold text-slate-950">Review happens after each question</h1>
          <p className="mx-auto mb-8 max-w-lg text-slate-600">
            This quiz now shows correctness and explanation immediately after you submit each question. Continue from the quiz player to finish and calculate your final score.
          </p>
          <button
            onClick={() => navigate(`/quiz/${id}/play`)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-red-200 transition-colors hover:bg-red-800"
          >
            Continue Quiz <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
