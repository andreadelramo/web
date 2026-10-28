import PDFKit
import AppKit
import Vision

let source = CommandLine.arguments[1]
let output = CommandLine.arguments[2]
let doc = PDFDocument(url: URL(fileURLWithPath: source))!
try FileManager.default.createDirectory(atPath: output, withIntermediateDirectories: true)

// Coordinates are in the 1200 × 776 reference renders of the supplied PDF.
let crops: [(Int, String, CGRect)] = [
    (3, "andrea", CGRect(x: 59, y: 562, width: 107, height: 156)),
    (4, "github-cover", CGRect(x: 495, y: 69, width: 645, height: 634)),
    (5, "github-calendar", CGRect(x: 59, y: 221, width: 644, height: 482)),
    (5, "github-mobile", CGRect(x: 735, y: 69, width: 405, height: 509)),
    (6, "exhibify-cover", CGRect(x: 495, y: 69, width: 645, height: 634)),
    (7, "exhibify-tablet", CGRect(x: 59, y: 69, width: 644, height: 533)),
    (7, "exhibify-desktop", CGRect(x: 735, y: 71, width: 405, height: 632)),
    (8, "dokify-cover", CGRect(x: 495, y: 69, width: 645, height: 634)),
    (9, "dokify-system", CGRect(x: 59, y: 69, width: 644, height: 634)),
    (9, "dokify-mobile", CGRect(x: 735, y: 328, width: 405, height: 375)),
    (10, "ctt-cover", CGRect(x: 495, y: 69, width: 645, height: 634)),
    (11, "ctt-shipping", CGRect(x: 59, y: 69, width: 644, height: 634)),
    (11, "ctt-mobile", CGRect(x: 735, y: 69, width: 405, height: 437))
]

for i in 0..<doc.pageCount {
    let page = doc.page(at: i)!
    let thumbnail = page.thumbnail(of: NSSize(width: 2400, height: 1600), for: .mediaBox)
    var rect = CGRect(origin: .zero, size: thumbnail.size)
    let cg = thumbnail.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
    print("\n--- PAGE \(i + 1) ---")
    if CommandLine.arguments.contains("--ocr") {
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.recognitionLanguages = ["es", "en"]
        do {
            try VNImageRequestHandler(cgImage: cg).perform([request])
            for result in request.results ?? [] { print(result.topCandidates(1).first?.string ?? "") }
        } catch { print("OCR unavailable: \(error)") }
    }
    let scaleX = CGFloat(cg.width) / 1200
    let scaleY = CGFloat(cg.height) / 776
    for (_, name, area) in crops.filter({ $0.0 == i + 1 }) {
        let crop = CGRect(x: area.minX * scaleX, y: area.minY * scaleY, width: area.width * scaleX, height: area.height * scaleY)
        let bitmap = NSBitmapImageRep(cgImage: cg.cropping(to: crop.integral)!)
        let bytes = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.88])!
        try bytes.write(to: URL(fileURLWithPath: output).appendingPathComponent("\(name).jpg"))
    }
}
