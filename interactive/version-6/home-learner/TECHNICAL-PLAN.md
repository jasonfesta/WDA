# Technical feasibility plan — no implementation

## Capability layers

Separate capture, annotation, retrieval, inference and training. A lesson can become useful structured data before a model is trained. A pretrained observation model could propose labels for review without changing its weights. Training a small visual head is a different operation from adapting a temporal video model, and neither produces a general household agent.

A feasible narrow experiment freezes an image feature extractor and trains a small head on reviewed examples, following the [TensorFlow.js transfer-learning codelab](https://codelabs.developers.google.com/tensorflowjs-transfer-learning-teachable-machine). [Image classification](https://developers.google.com/edge/mediapipe/solutions/vision/image_classifier) yields categories for frames; it does not by itself establish a sequence's completion. Temporal observation needs its own model, labels, compute budget and evaluation. Voice notes, transcription and sound classification likewise remain separate capabilities.

## Capture adapters and data

Phone and webcam access would use supported platform APIs with explicit permission. Head-camera support requires a verified live-stream adapter, compatible webcam mode, supported device bridge or file import. No universal headcam protocol is assumed. Preserve source timestamps, clock offsets where needed, interruptions and camera orientation. Begin with one source per segment; synchronized multi-camera capture is a later research question.

Proposed records are Lesson, Session, Segment, Annotation, DatasetVersion, ModelVersion, TrainingRun and Evaluation. Versions are immutable references; corrections produce new dataset revisions. Test sessions remain separate from training until explicitly reassigned, avoiding adjacent-frame leakage. Derived features include extractor and preprocessing versions.

## Local and cloud choices

Evaluate a local-only capture/review route first. A device capability check determines whether small-head training is practical. Larger observation or adaptation workloads may require a separately consented service with explicit inputs and retention. Backend choice cannot be hidden behind the word local if data is transmitted.

## Future device workers

Devices join only after invitation, capability checks and explicit opt-in. Capture workers contribute media, feature workers compute versioned embeddings, and eligible training workers process bounded jobs. A coordinator would manage leases, retries, checkpoints and accepted results. Pause/Stop/Leave must remain visible. This is a future architecture hypothesis, not implemented federated learning; embeddings and gradients are not automatically private.

The first investigation should prove one source, reviewed annotations and an unseen evaluation with a bounded model. Only then assess temporal models, additional sources and distributed work. No dependency installation, runtime code, camera activation, model download or training accompanies this plan.


## Android platform decision

The preferred future product is a native Android companion; Kotlin/Compose is a candidate for UI evaluation, not a selected dependency installed here. Assess Android camera/media and headcam adapter paths before choosing a model runtime. The browser transfer-learning source explains the learning strategy, not a commitment to a JavaScript runtime inside this app. Preserve edge-to-edge insets, permission states and background interruption behavior in any later prototype.
