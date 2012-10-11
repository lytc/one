jasmine.CustomReporter = function() {
    this.reportRunnerResults = function(runner) {
        var spec
            ,failedItems = []
            ,failedItem
            ,suiteItem
            ,parentSuite
            ,specs = runner.specs()

        for (var i = 0, len = specs.length; i < len; ++i) {
            spec = specs[i]

            if (!spec.results_.failedCount) {
                continue
            }

            failedItem = {
                description: spec.description
                ,items: []
            }

            for (var j = 0, jlen = spec.results_.items_.length; j < jlen; ++j) {
                if (spec.results_.items_.passed_) {
                    continue
                }
                failedItem.items.push({
                    message: spec.results_.items_[j].message
                    ,trace: spec.results_.items_[j].trace.stack
                })

                failedItems.push(failedItem)
            }

            suiteItem = []
            suiteItem.push(spec.suite.description)
            parentSuite = spec.suite.parentSuite
            while (parentSuite) {
                suiteItem.push(parentSuite.description)
                parentSuite = parentSuite.parentSuite
            }

            failedItem.suite = suiteItem
        }

        var reportUrl = 'http://103.3.244.123/~lytc/one-test-report.php'
            ,data = {
                report: {
                    ua: navigator.userAgent
                }
            }

        if (failedItems.length) {
            data.report.items = failedItems
        }

        $.post(reportUrl, data)
    }
}